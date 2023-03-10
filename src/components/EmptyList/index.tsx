import ErrorIcon from "@mui/icons-material/Error";

export function EmptyList() {
  return (
    <section className="c-empty-list">
      <ErrorIcon className="c-empty-list--icon" />
      <h1 className="c-empty-list--title">Nenhum registro foi encontrado.</h1>
    </section>
  );
}
