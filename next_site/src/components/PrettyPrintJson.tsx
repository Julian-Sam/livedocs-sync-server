export const PrettyPrintJson = ({ data }: { data: object }) => {
  return (<div><pre>{JSON.stringify(data, null, 2)}</pre></div>);
}

