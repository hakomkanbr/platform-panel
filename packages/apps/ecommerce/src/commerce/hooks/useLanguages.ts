import { useQuery } from "@tanstack/react-query";
import { languagesApi, type CommerceLanguage } from "../api/catalog/languages";

export function useProjectLanguages(projectId: string | null) {
  return useQuery({
    queryKey: ["commerce", "languages", projectId],
    queryFn: (): Promise<CommerceLanguage[]> => languagesApi.list(projectId as string),
    enabled: !!projectId,
  });
}