import { AxiosError } from "axios";
import axios from "@/api/axios";
import { useMutation } from "react-query";

async function deletePost(postId: number) {
  await axios.delete(`post/${postId}`)
}

function useDeletePost(postId: number)  {
  return useMutation<void, AxiosError, number>({
    mutationFn: () => deletePost(postId),
  })
}

export { useDeletePost };
