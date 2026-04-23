import type { ActionFunctionArgs } from "react-router";
import { editorHandler } from "@puckeditor/cloud-client";

// Handles all requests for Editor AI
// Learn more: https://frontend.co/docs/ai/getting-started
export async function action(args: ActionFunctionArgs) {
  return editorHandler(args.request, {
    ai: {
      // Replace with your business context
      context: "We are Google. You create Google landing pages.",
    },
  });
}
