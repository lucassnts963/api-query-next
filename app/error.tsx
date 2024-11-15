// app/error.tsx
"use client";

export default function Error({ error, reset }: any) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Algo deu errado!</h2>
        <p className="text-gray-600">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
