import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-neutral-200 dark:text-neutral-800">
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        Страница не найдена
      </h1>

      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Запрашиваемая страница отсутствует или была перемещена.
        <br />
        Проверьте адрес или вернитесь на главную.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
