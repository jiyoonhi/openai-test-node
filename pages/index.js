import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [genreInput, setGenreInput] = useState("");
  const [result, setResult] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imgResult, setImgResult] = useState("");

  async function onSubmitNames(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generateNames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genre: genreInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setGenreInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmitImage(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setImgResult(data.result);
      setImageInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>GPT Movies</title>
        <link rel="icon" href="/movie.png" />
      </Head>

      <main className={styles.main}>
        <img src="/movie.png" className={styles.icon} />
        <h3>Movie Recommendation</h3>
        <form onSubmit={onSubmitNames}>
          <input
            type="text"
            name="genre"
            placeholder="Enter a movie genre"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <input type="submit" value="Get movie names" />
        </form>
        <div className={styles.result}>{result}</div>
        <br></br>
        <br></br>
        <img src="/fantasy.png" className={styles.icon} />
        <h3>Create Movie Character</h3>
        <form onSubmit={onSubmitImage}>
          <input
            type="text"
            name="prompt"
            placeholder="Write two movies (e.g. parasite, harry potter)"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <input type="submit" value="Generate new character" />
        </form>
        {imgResult && <img className={styles.imgResult} src={imgResult} alt="prompt" />}
      </main>
    </div>
  );
}
