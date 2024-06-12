export default function Ready({ onClick }: { onClick: () => void }) {
  return (
    <section>
      <label>
        <button onClick={onClick}>Ready?</button>
      </label>
    </section>
  );
}
