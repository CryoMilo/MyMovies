import React, { useState, useEffect, useRef } from "react";
import NavbarTitleBgShape from "../public/static/assets/website-title-bg-shape.svg";
import { SearchIcon } from "@heroicons/react/outline";
import Link from "next/link";
import axios from "axios";

export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [closeResults, setCloseResults] = useState(true);
  const resultsRef = useRef();

  // console.log(closeResults);

  useEffect(() => {
    axios
      .get(
        `
    https://api.themoviedb.org/3/search/movie?api_key=82a18ed118951da924967971e5b70de4&language=en-US&query=${
      searchValue === "" ? "emptymovie" : searchValue
    }&page=1&include_adult=false`
      )
      .then((data) => setSearchResults(data.data.results));
  }, [searchValue]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        setCloseResults(true);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resultsRef]);

  // console.log(searchResults.slice(0, 10));
  // console.log(closeResults);

  return (
    <div className="navbar h-28 shadow-emerald bg-lightGray">
      <div className="navbar__content flex w-4/5 justify-between items-center m-auto h-full">
        <div className="navbar__title relative">
          <Link href={`/`}>
            <a className="navbar__title-link text-gray-600 text-2xl relative z-10">
              MyMovies
            </a>
          </Link>

          <div className="navbar__title-bg-shape absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 z-0">
            <NavbarTitleBgShape />
          </div>
        </div>
        <div className="navbar__right-items flex w-8/12 justify-end items-center flex-1">
          <div className="navbar__search-bar min-w-300 relative mr-10">
            <label
              htmlFor="search"
              className="navbar__label text-gray-500 transition"
            >
              <SearchIcon className="h-5 w-5 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
              <input
                name="search"
                id="search"
                type="text"
                autoComplete="off"
                value={searchValue}
                onFocus={(e) => {
                  if (e.target.value === "") {
                    setCloseResults(true);
                  } else {
                    setCloseResults(false);
                  }
                }}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCloseResults(false);
                }}
                className="navbar__search-input focus:outline-none focus:ring-green-300 focus:ring-2 focus:border-transparent px-4 pl-10 py-2 text-gray-900 bg-green-100 transition rounded-lg text-sm w-full placeholder-gray-400"
                placeholder="Search Anything .."
              />
            </label>
            {!closeResults && (
              <div
                className="search-results absolute top-[50px] left-0 bg-green-50 rounded p-4 w-full"
                ref={resultsRef}
              >
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.slice(0, 10).map((r, i) => {
                      return (
                        <li key={i} className="p-1">
                          <a href="#">{r.title}</a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  "No results"
                )}
              </div>
            )}
          </div>

          <nav className="navbar__nav flex text-gray-500 ">
            <Link href={`/`}>
              <a className="navbar__link mr-4">Trending</a>
            </Link>
            <Link href={`/`}>
              <a className="navbar__link mr-4">Popular</a>
            </Link>
            <Link href={`/`}>
              <a className="navbar__link mr-4">Upcoming</a>
            </Link>
            <Link href={`/`}>
              <a className="navbar__link">Top Rated</a>
            </Link>

            {/* <a className="navbar__link mr-4" href="#">
              Upcoming
            </a>
            <a className="navbar__link" href="#">
              Top Rated
            </a> */}
          </nav>
        </div>
      </div>
    </div>
  );
}
