import ItemTable from "@/components/Items/ItemTable"
import Navbar from "@/components/Navbar"


const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }
  .content {
    position: relative;
    z-index: 2;
  }`




const Dashboard = () => {

  return (
    <main
    className="min-h-screen flex items-center justify-center"
    style={{
      background: "radial-gradient(circle at center, #1E40AF, #000000)",
    }}
  >
        <style>
      {backgroundStyle}
    </style>
    <div className="bg-pattern"></div>
    <div className="content w-full">
      <Navbar/>
<ItemTable/>
</div>
</main>


  )
}

export default Dashboard