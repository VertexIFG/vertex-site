import './VideoPage.css'

// /video — the sixty second film. Native controls (play, pause, scrub, full
// screen), autoplays muted and loops; the file lives in the marketing bucket.
const MEDIA = 'https://lqxnfzmwlpqadhpxsigs.supabase.co/storage/v1/object/public/marketing-media'
export const VIDEO_SRC = `${MEDIA}/vertex-ifg-film-1080-v4.mp4`
export const VIDEO_POSTER = `${MEDIA}/vertex-ifg-film-poster-v4.jpg`

function VideoPage() {
  return (
    <section className="videopage theme-dark" aria-labelledby="videopage-title">
      <div className="container">
        <h1 id="videopage-title" className="videopage-title">Video</h1>
        <div className="videopage-stage">
          <video
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={VIDEO_POSTER}
            aria-label="Vertex Infrastructure Group: horizontal directional drilling for fiber, gas, electric and water"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}

export default VideoPage
