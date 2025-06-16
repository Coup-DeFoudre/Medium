import {
  createPostInput,
  updatePostInput,
} from "@iamrishabhpathak/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

// Initialize blogRouter with Hono framework and types
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

/**
 * Helper function to create Prisma client
 */
const createPrismaClient = (databaseUrl: string) => {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());
};

/**
 * Middleware to verify JWT on all routes
 */
blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized: Missing token" });
  }

  try {
    const token = jwt.split(" ")[1];
    if (!token) {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token format" });
    }

    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || typeof payload.id !== "string") {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token" });
    }

    c.set("userId", payload.id);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Unauthorized: Token verification failed" });
  }
});

/**
 * Route to create a new blog post
 */
blogRouter.post("/", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();

    const { success, data } = createPostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "Invalid input data" });
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: c.get("userId"),
      },
    });

    return c.json({ message: "Post created successfully", id: post.id });
  } catch (err) {
    console.error("Error creating post:", err);
    c.status(500);
    return c.json({ error: "Failed to create post" });
  }
});

/**
 * Route to update an existing blog post
 */
blogRouter.put("/", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    const { success, data } = updatePostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "Invalid input data" });
    }

    // Check if the post exists and is owned by the user
    const existingPost = await prisma.post.findUnique({
      where: { id: data.id },
      select: { authorId: true },
    });

    if (!existingPost) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    if (existingPost.authorId !== userId) {
      c.status(403);
      return c.json({ error: "Forbidden: You do not own this post" });
    }

    const post = await prisma.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content
      },
    });

    return c.json({ message: "Post updated successfully", id: post.id });
  } catch (err) {
    console.error("Error updating post:", err);
    c.status(500);
    return c.json({ error: "Failed to update post" });
  }
});

/**
 * Route to fetch all blog posts with pagination
 */
blogRouter.get("/bulk", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);

  try {
    // Add pagination support
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: { name: true ,bio:true },
          },
        },
      }),
      prisma.post.count(),
    ]);

    return c.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch posts" });
  }
});

/**
 * Route to fetch a single blog post by ID
 */
blogRouter.get("/:id", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);

  try {
    const id = c.req.param("id");

    // Basic validation for ID format (assuming UUID)
    if (!id || id.length < 1) {
      c.status(400);
      return c.json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: { name: true },
        },
      },
    });

    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    return c.json({ post });
  } catch (err) {
    console.error("Error fetching post:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});

/**
 * Route to delete a blog post by ID (with ownership check)
 */
blogRouter.delete("/:id", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const userId = c.get("userId");

  try {
    const id = c.req.param("id");

    // Basic validation for ID format
    if (!id || id.length < 1) {
      c.status(400);
      return c.json({ error: "Invalid post ID" });
    }

    // Check if the post exists and is owned by the user
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    if (post.authorId !== userId) {
      c.status(403);
      return c.json({ error: "Forbidden: You do not own this post" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    return c.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    c.status(500);
    return c.json({ error: "Failed to delete post" });
  }
});

/**
 * Route to get posts by the current user
 */
blogRouter.get("/my/posts", async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const userId = c.get("userId");

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    return c.json({ posts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch your posts" });
  }
});