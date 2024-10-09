navigator.serial.requestPort({ /* Optional filters */ })
    .then(port => {
      port.open({ baudRate: 9600 })
        .then(() => {
          const reader = port.readable.getReader();
          const textDecoder = new TextDecoder();
          
          const readLoop = () => reader.read()
            .then(({ value, done }) => {
              if (done) return; // Exit loop if stream is closed
              if (!value) return readLoop(); // Continue looping if no data

              console.log('Raw Value', value);
              const data = textDecoder.decode(value);
              output.textContent += data;
              console.log('Data', data);
              return readLoop(); // Recursively call to keep reading
            })
            .catch(error => {
              console.error('Error reading from serial port:', error);
            });

          readLoop();
        })
        .catch(error => {
          console.error('Error opening serial port:', error);
        });
    })
    .catch(error => {
      console.error('Error requesting serial port:', error);
    });
