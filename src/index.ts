import 'dotenv/config';
import app from './app';

process.on('uncaughtException', (error) => {
  console.log(
    'UNCAUGHT EXCEPTION 💢:',
    error.name,
    error.message,
    error.stack,
    '\nGracefully shutting down...'
  );
  process.exit(1);
});

const PORT = process.env.PORT ?? '8000';

const start = async () => {
  try {
    await app.listen(PORT);
    console.log(`running on ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (error: any) => {
  console.log(
    'UNHANDLED REJECTION 💥:',
    error.name,
    error.message,
    error.stack,
    '\nGracefully shutting down...'
  );

  app.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED 🙃, shutting down gracefully...');

  app.close(() => {
    console.log('Process terminated 💀');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT RECEIVED 🙃, shutting down gracefully...');

  app.close(() => {
    console.log('Process terminated 💀');
  });
});

start();
