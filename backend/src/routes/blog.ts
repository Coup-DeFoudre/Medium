import {
  createPostInput,
  updatePostInput,
} from "@iamrishabhpathak/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized: Missing token" });
  }

  try {
    const token = jwt.split(" ")[1];
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

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Input not correct",
    });
  }
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("userId"),
      },
    });

    return c.json({ message: "Post created", id: post.id });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to create post", details: err });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Input not correct",
    });
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ message: "Post updated", id: post.id });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update post", details: err });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select:{
        content:true,
        title:true,
        id:true,
        createdAt:true,
        author:{
          select:{
            name:true
          }
        }
      }
    });
    return c.json({ posts });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch posts", details: err });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const id = c.req.param("id");

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select:{
        content:true,
        title:true,
        id:true,
        createdAt:true,
        author:{
          select:{
            name:true
          }
        }
      }
    });

    return c.json({ post });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch post", details: err });
  }
});
