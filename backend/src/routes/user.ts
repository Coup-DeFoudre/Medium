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
  Variables: {};
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
