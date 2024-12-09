import RegisterForm from "@/components/form/RegisterForm"
import Layout from "@/components/Layout"


const RegisterPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center max-w-md mx-auto mt-24 min-h-screen">
        <RegisterForm/>
    </div>
    </Layout>
    
  )
}

export default RegisterPage