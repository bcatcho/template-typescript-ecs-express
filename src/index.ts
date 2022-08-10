import express, { Request, Response } from "express"

const app = express()
app.use(express.json())

/**
 * Health endpoint
 */
app.get('/health', (_: Request, res: Response) => {
  res.sendStatus(200)
})

let isCleaningUp = false
async function exitHandler(exit: boolean, exitCode?: any) {
  if (!isCleaningUp) {
    isCleaningUp = true
    console.log('Executing cleanup')
  }
  if (exitCode) console.log(exitCode);
  if (exit) process.exit();
}

//catches ctrl+c event
process.on('SIGINT', (exitCode) => exitHandler(true, exitCode));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', (exitCode) => exitHandler(true, exitCode));
process.on('SIGUSR2', (exitCode) => exitHandler(true, exitCode));

//catches uncaught exceptions
process.on('uncaughtException', (exitCode) => exitHandler(true, exitCode));
process.on('beforeExit', async () => exitHandler(false, null));

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`Listening on PORT: ${port}`))

