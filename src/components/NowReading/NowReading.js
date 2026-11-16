import React from "react";
import { useApi } from "../../utils/useApi";

// Column 2: my Goodreads "currently-reading" shelf (via /api/goodreads-reading)
const NowReading = () => {
  const { status, data } = useApi("/api/goodreads-reading");
  const books = data?.books ?? [];

  return (
    <section className="Now-column" aria-labelledby="now-reading">
      <h2 className="Now-column-title" id="now-reading">
        Reading
      </h2>
      {status === "loading" && <p className="Now-note">Loading…</p>}
      {status === "error" && (
        <p className="Now-note">Couldn’t reach Goodreads right now.</p>
      )}
      {status === "ready" && books.length === 0 && (
        <p className="Now-note">Between books at the moment.</p>
      )}
      {books.length > 0 && (
        <ul className="Now-books">
          {books.map((book) => (
            <li key={book.id}>
              <a className="Now-book" href={book.url}>
                {book.image && (
                  <img
                    className="Now-book-cover"
                    src={book.image}
                    alt=""
                    loading="lazy"
                  />
                )}
                <span className="Now-book-text">
                  <span className="Now-item-title">{book.title}</span>
                  <span className="Now-item-meta">{book.author}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="Now-source">
        Pulled live from my{" "}
        <a href="https://www.goodreads.com/user/show/160746993">Goodreads</a>{" "}
        profile.
      </p>
    </section>
  );
};

export default NowReading;
