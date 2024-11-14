import Layout from "@/components/Layout"
import ItemTable from "../components/Items/ItemTable"
import { useAuthStore } from "@/context/store"





const Dashboard = () => {

  return (
<Layout>
  <ItemTable/>
</Layout>

  )
}

export default Dashboard