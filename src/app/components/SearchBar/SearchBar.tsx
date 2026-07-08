"use client";

import { useState, useCallback } from "react";
import { IoSearch, IoClose } from "react-icons/io5";

type Props = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
};

export function SearchBar({ onSearch, isLoading = false }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="店舗名・住所で検索"
        className="w-full pl-10 pr-10 py-2.5 bg-white rounded-full shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={isLoading}
      />
      <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
        >
          <IoClose className="w-full h-full" />
        </button>
      )}
    </form>
  );
}
