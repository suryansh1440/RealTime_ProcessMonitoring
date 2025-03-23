const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Function to get system metrics
async function getSystemMetrics() {
  try {
    const [cpu, mem, processes] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.processes()
    ]);

    // Calculate memory usage percentage
    const memoryUsagePercent = ((mem.total - mem.available) / mem.total) * 100;

    // Process the list of processes to get relevant information
    const processDetails = processes.list
      .sort((a, b) => b.cpu - a.cpu) // Sort by CPU usage
      .slice(0, 50) // Get top 50 processes
      .map(proc => ({
        id: proc.pid,
        name: proc.name,
        cpu: proc.cpu.toFixed(1),
        memory: Math.round(proc.memRss / (1024 * 1024)), // Convert to MB
        status: proc.state
      }));

    return {
      cpuUsage: Math.round(cpu.currentLoad),
      memoryUsage: Math.round(memoryUsagePercent),
      activeProcesses: processes.all,
      processes: processDetails
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return null;
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  let metricsInterval;

  // Send initial data
  getSystemMetrics().then(metrics => {
    if (metrics) {
      socket.emit('systemMetrics', metrics);
    }
  });

  // Set up interval for real-time updates
  metricsInterval = setInterval(async () => {
    const metrics = await getSystemMetrics();
    if (metrics) {
      socket.emit('systemMetrics', metrics);
    }
  }, 2000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (metricsInterval) {
      clearInterval(metricsInterval);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 