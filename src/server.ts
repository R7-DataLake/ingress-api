import app from './app'

const start = async () => {
  try {

    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          app.close().then((error: any) => {
            console.log(`close application on ${signal}`)
            process.exit(error ? 1 : 0)
          }),
        )
      }
    }

    const port = process.env.R7PLATFORM_INGR_PORT ? Number(process.env.R7PLATFORM_INGR_PORT) : 3000

    app.listen({ port, host: '0.0.0.0' }, (err, _address) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start()
