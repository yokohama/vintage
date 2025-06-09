import New from "./clients/components/New";

export default async function NewPage({
  params,
}: {
  params: {
    vintageId: string;
  };
}) {
  const vintageId = parseInt(params.vintageId, 10);
  return <New vintageId={vintageId} />;
}
