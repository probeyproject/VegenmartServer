import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../API/Api";

export const VideoAds = () => {
  const [video, setVideo] = useState([]);

  const getAllVideo = async () => {
    const response = await axios.get(`${baseUrl}/getAllVideo`);
    const data = await response.data;
    setVideo(data);
  };

  useEffect(() => {
    getAllVideo();
  }, []);

  return (
    <>
      <div className="title d-block">
        {video.map((data, index) => (
          <div key={index}>
            <h2>{data.video_heading}</h2>
            <span className="title-leaf">
              
            </span>
            <p>
              Ozonized vegetables are treated with ozone gas, a natural
              disinfectant that eliminates bacteria and fungi without chemical
              residues. This process extends shelf life while preserving
              nutrients and taste. Ozonization is eco-friendly, safe for
              consumption, and aligns with organic farming practices. As
              consumer interest in healthier, chemicals-free food grows,
              ozonized vegetables are becoming increasingly popular.
            </p>
            <video
  controls
  autoPlay
  loop
  muted
  className="w-100 mt-2 rounded-4"
  src={data.video_url}
  type="video/mp4"
  loading="lazy" // Lazy load the video when it's near the viewport
>
  Your browser does not support the video tag.
</video>

          </div>
        ))}
      </div>
    </>
  );
};
