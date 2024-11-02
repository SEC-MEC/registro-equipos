

const LoginForm = () => {
  return (
    <div>
      <form action="POST">

        <div>
          <label htmlFor="">Username</label>
          <input type="text" className="px-3 py-2 rounded-md border text-xl"  />
        </div>
              <div>
          <label htmlFor="">Pass</label>
          <input type="password" className="px-3 py-2 rounded-md border text-xl"  />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default LoginForm