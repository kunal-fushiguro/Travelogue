import z from "zod";

const createPostSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(3, { message: "Title must be 3 characters long." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(10, { message: "Description must be 10 characters long." }),
  coverImage: z
    .string({ required_error: "Cover Image is required." })
    .min(15, { message: "Cover Image URL is Invalid." }),
  isPublic: z.boolean(),
});

const updatePostSchema = z.object({
  postid: z.string({ required_error: "Post id is required." }),
  title: z
    .string({ required_error: "Title is required." })
    .min(3, { message: "Title must be 3 characters long." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(10, { message: "Description must be 10 characters long." }),
  coverImage: z
    .string({ required_error: "Cover Image is required." })
    .min(15, { message: "Cover Image URL is Invalid." }),
  isPublic: z.boolean(),
});

export { createPostSchema, updatePostSchema };
