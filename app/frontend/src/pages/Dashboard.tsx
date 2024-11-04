import ItemTable from "../components/Items/ItemTable"
import Navbar from "../components/Navbar"




const Dashboard = () => {



  return (
<div className="min-h-screen">
  <nav className="pt-4">
 <Navbar/>
  </nav>
      <ItemTable/>
</div>

  )
}

export default Dashboard