export default async function NewCheckPointPage({
  params,
}: {
  params: { vintageId: string };
}) {
  const vintageId = parseInt(params.vintageId, 10);
  return <>{vintageId}</>;
}
