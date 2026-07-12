import { BUDGETS, GENRES, LARGE_AREAS } from "@/lib/constants";

// SSRページでも動くGETフォーム検索(JS無効環境でも/search?...に遷移して機能する)。
export default function SearchForm({
  defaultValues,
}: {
  defaultValues?: {
    keyword?: string;
    area?: string;
    genre?: string;
    budget?: string;
    privateRoom?: boolean;
    nonSmoking?: boolean;
    freeDrink?: boolean;
    course?: boolean;
  };
}) {
  const dv = defaultValues ?? {};

  return (
    <form action="/search" method="get" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="keyword"
          defaultValue={dv.keyword}
          placeholder="キーワード(店名・料理名など)"
          className="col-span-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
        />
        <select name="area" defaultValue={dv.area ?? ""} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
          {LARGE_AREAS.map((a) => (
            <option key={a.code} value={a.code}>
              {a.name}
            </option>
          ))}
        </select>
        <select name="genre" defaultValue={dv.genre ?? ""} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
          {GENRES.map((g) => (
            <option key={g.code} value={g.code}>
              {g.name}
            </option>
          ))}
        </select>
        <select name="budget" defaultValue={dv.budget ?? ""} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2">
          {BUDGETS.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="privateRoom" value="1" defaultChecked={dv.privateRoom} /> 個室あり
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="nonSmoking" value="1" defaultChecked={dv.nonSmoking} /> 禁煙席あり
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="freeDrink" value="1" defaultChecked={dv.freeDrink} /> 飲み放題あり
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="course" value="1" defaultChecked={dv.course} /> コースあり
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 px-4 py-2.5 text-sm font-bold text-white hover:from-orange-700 hover:to-orange-500"
      >
        🔍 今すぐ検索
      </button>
    </form>
  );
}
