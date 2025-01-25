import { SlSocialSpotify } from "react-icons/sl";
import { BsClipboard } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [URL, setURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("downloadHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const handleURL = (e) => {
    setURL(e.target.value);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setURL(text);
    } catch {
      alert("Failed to read from clipboard.");
    }
  };

  const saveToHistory = (songName, downloadLink) => {
    const newHistory = [...history, { songName, downloadLink }];
    setHistory(newHistory);
    localStorage.setItem("downloadHistory", JSON.stringify(newHistory));
  };

  const downloadSong = async () => {
    if (!URL.trim()) {
      setError("Please enter a valid Spotify song URL.");
      return;
    }
    setLoading(true);
    setError("");

    const options = {
      method: "GET",
      url: "https://spotify-downloader9.p.rapidapi.com/downloadSong",
      params: { songId: `${URL}` },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": "spotify-downloader9.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const { downloadLink, title } = response.data.data;

      if (downloadLink) {
        window.location.href = downloadLink;
        saveToHistory(title, downloadLink);
      } else {
        setError("Could not fetch the download link. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
      setURL("");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`h-screen w-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-900"
      } flex flex-col items-center justify-center p-6`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 text-3xl font-extrabold mb-6">
        <SlSocialSpotify size={50} />
        <p>Spotify </p>
        <br></br>
        <button
          className="ml-4 p-2 border rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="url"
          placeholder="Enter Spotify song URL..."
          className="h-12 w-full sm:w-[450px] rounded-lg px-4 text-lg shadow-md outline-none focus:ring-2 focus:ring-purple-300 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-500"
          onChange={handleURL}
          value={URL}
        />
        <button
          className="h-12 px-6 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 flex items-center"
          onClick={pasteFromClipboard}
        >
          <BsClipboard size={20} className="mr-2" />
          Paste URL
        </button>
        <button
          className="h-12 px-6 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 active:bg-green-800 transition-all duration-200 flex items-center"
          onClick={downloadSong}
          disabled={loading}
        >
          {loading ? (
            <FiLoader size={20} className="mr-2 animate-spin" />
          ) : (
            "Download"
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 font-bold mb-4 dark:text-red-400">{error}</p>
      )}

      {/* Download History */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-3xl bg-white rounded-lg p-4 shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            Download History
          </h3>
          <ul className="space-y-3">
            {history.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-gray-700 dark:text-gray-300"
              >
                <span className="truncate">{item.songName}</span>
                <a
                  href={item.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline dark:text-blue-400"
                >
                  Download Again
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-sm text-gray-700 dark:text-gray-400">
  <p className='text-2xl text-white '>By... 
    <a 
      href="https://github.com/tripathiayushman" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-purple-600 dark:text-purple-400 hover:underline ml-1"
    >
      <span className='text-2xl text-white'>Ayushman Tripathi</span>
    </a>
  </p>
</footer>

    </div>
  );
}

export default App;
