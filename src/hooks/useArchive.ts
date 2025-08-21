import { useMutation } from "@tanstack/react-query";
import { archiveApi, type ToggleArchiveParams } from "../apis/archive";

export const useToggleArchive = () => {
  return useMutation<boolean, unknown, ToggleArchiveParams>({
    mutationFn: (params: ToggleArchiveParams) =>
      archiveApi.toggleArchive(params),
  });
};
