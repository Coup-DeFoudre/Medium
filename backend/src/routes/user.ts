import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput,signinInput } from "@iamrishabhpathak/medium-common";
import { verify } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(411)
    return c.json({
        message:"Input not correct"
    })
  }
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
      select:{
        id:true,
        name:true,
        email:true,
      }
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ message: "User signup successfully", token,  });
  } catch (error) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
   const {success} = signinInput.safeParse(body);
  if(!success){
    c.status(411)
    return c.json({
        message:"Input not correct"
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
      select:{
        email:true,
        name:true,
        id:true
      }
    });
    if (!user) {
      return c.json({
        message: "User not found",
      });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ message: "User found", token,user });
  } catch (error) {
    return c.status(403);
  }
});


userRouter.get("/", async (c) => {
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

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio:true
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    return c.json({ user });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch user", details: err });
  }
});


//update user
userRouter.put("/", async (c) => {
  // Get the logged-in user's ID from the verified JWT payload
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

    // Optionally, you can also set the user id in context for future use
    c.set("userId", payload.id);

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { name, bio } = body;

    // Only allow updating name or bio
    if (typeof name !== "string" && typeof bio !== "string") {
      c.status(400);
      return c.json({ error: "Nothing to update. Provide name or bio." });
    }

    const updateData: { name?: string; bio?: string } = {};
    if (typeof name === "string") updateData.name = name;
    if (typeof bio === "string") updateData.bio = bio;

    const user = await prisma.user.update({
      where: {
        id: payload.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
      },
    });

    return c.json({ user });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update user", details: err });
  }
});



//change password 

userRouter.put("/change-password", async (c) => {
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

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      c.status(400);
      return c.json({ error: "Old and new passwords are required" });
    }

    // Verify old password
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { password: true },
    });

    if (!user || user.password !== oldPassword) {
      c.status(403);
      return c.json({ error: "Old password is incorrect" });
    }

    // Update to new password
    await prisma.user.update({
      where: { id: payload.id },
      data: { password: newPassword },
    });

    return c.json({ message: "Password changed successfully" });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to change password", details: err });
  }
});
