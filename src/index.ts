import app from './app'

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.info(`Express server listening on http://localhost:${PORT}`)
})
