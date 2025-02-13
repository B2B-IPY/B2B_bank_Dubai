import img from "/assets/not-found.png";
function NotFound() {
  return (
    <>
      <div className="gap-10 flex-col w-full h-screen flex items-center justify-center bg-[var(--background-primary-color)]">
        <img src={img} alt="not found" width={300} />
        <h1 className="font-lg font-bold">Página não encontrada</h1>
      </div>
    </>
  );
}
export default NotFound;
