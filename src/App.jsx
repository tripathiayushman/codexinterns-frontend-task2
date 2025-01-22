import React from "react"
import { SlSocialSpotify } from "react-icons/sl";
import axios from "axios"
import { useState } from "react";

function App() {
  const [URL, setURL] = useState("")

  const handleURL = (e) => {
    e.preventDefault()
    setURL(e.target.value)
  }

  console.log(URL)

  const downloadSong = async () => {
    setURL("")
    const options = {
      method: 'GET',
      url: 'https://spotify-downloader9.p.rapidapi.com/downloadSong',
      params: {
        songId: `${URL}`
      },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_API_KEY,
        'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
      }
    };

    try {
      const rspn = await axios.request(options)
      // console.log(rspn.data.data.downloadLink)
      window.location.href = rspn.data.data.downloadLink
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      classNameName="h-screen w-screen bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-rose-600 via-emerald-600 to-amber-500 flex items-center justify-center flex-col gap-y-5"
    >
      <div
        classNameName="flex items-center justify-center gap-x-2 text-xl font-bold"
      >
        <SlSocialSpotify size={50}/>
        <p>Song Downloader</p>
      </div>

      <div
        classNameName="flex gap-x-2"
      >
        <input type="url" classNameName="h-10 w-[450px] border-none outline-none px-5 rounded-lg"
          onChange={handleURL} value={URL}
        />
        <button classNameName="bg-white h-10 px-2 rounded-lg font-bold hover:bg-black hover:text-white"
          onClick={downloadSong}
        >Download</button>
      </div>
    </div>
  )
}

export default App