import ItemTable from "@/components/items/ItemTable"

import Navbar from "@/components/Navbar"



const Dashboard = () => {



  return (
<div className="bg-gradient-to-r from-fuchsia-800  to-cyan-800 min-h-screen">
  <nav className="pt-4">
 <Navbar/>
  </nav>
    <ItemTable/>
</div>






  

    
    
   
  )
}

export default Dashboard