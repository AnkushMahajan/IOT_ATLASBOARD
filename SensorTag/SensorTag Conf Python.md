Install Bluez on the Raspberry Pi

1. Get the latest version of Bluez (the Bluetooth Stack for Linux). One can use wget utility to download the latest tar ball as shown below, on the Raspberry Pi terminal:

wget http://www.kernel.org/pub/linux/bluetooth/bluez-5.32.tar.xz
2. Before installing Bluez, the Raspberry Pi environment needs to be updated to have the following set of libraries installed on it:

glib
d-bus
libudev
libical
readline
libusb
Use the following set of commands to perform the installation of the said libraries:

sudo apt-get install libglib2.0-0 libglib2.0-dev

sudo apt-get install libdbus-1-dev

sudo apt-get install libudev-dev

sudo apt-get install libical-dev

sudo apt-get install libreadline-dev

sudo apt-get install libusb-1.0-0-dev
3. Extract the tar file downloaded earlier. Under the extracted directory structure, navigate to the main directory, whose name should read similar to bluez-5.32. You should find the configuration file configure under the directory mentioned above.

While configuring the bluez, we need to ensure that the following options are included:

--with-systemdsystemunitdir  --with-systemduserunitdir   --enable-library
4. Execute the following command to configure the Bluez

 sudo ./configure --prefix=/usr --mandir=/usr/share/man --sysconfdir=/etc --localstatedir=/var --with-systemdsystemunitdir --with-systemduserunitdir --enable-library

5. Post successful configuration, now perform make to install the Bluez

 sudo make
Of the tools available with the Bluez package, hcitool and gatttool are the two tools that will be of our interest, during the scope of this recipe. We shall use these tools to discover bluetooth addresses of the bluetooth enabled devices, that are physically close to the Raspberry Pi device and use bluetooth services published by the devices (in our case the TI SensorTag).

6. While in you are still in the main directory, copy the gatttool binary that got created in the earlier step, to ‘/usr/local/bin‘ folder

sudo cp attrib/gatttool /usr/local/bin
Scan to discover the TI Sensor Tag

7. Plug in the bluetooth dongle to one of the USB ports on the Raspberry Pi device and run the following command to activate the port if it is not already activated.

sudo hciconfig hci0 up
8. Scan for bluetooth enabled devices near to the Raspberry Pi device, using the hcitool as shown below.

sudo hcitool lescan
You should see a list of active unpaired bluetooth devices around you including the TI SensorTag in the following format:

C4:BE:78:A6:09 CC2650 Sensor Tag
Note down the bluetooth address for the Sensor Tag.

If you dont get to see an entry for the TI SensorTag, please plan to reboot the Raspberry Pi device with the bluetooth dongle still placed in one of its USB port.

Pair Raspberry Pi with TI sensor Tag

We will use Bluezs gatttool to pair the Raspberry Pi with TI Sensor Tag and enlist it for services provided by the SensorTag in order to read sensor data.

9. Establish an interactive session:

Syntax
gatttool -b [bluetooth_adr] --interactive

Command
gatttool -b C4:BE:78:A6:09 interactive
Once the session is open, you will see a command prompt as follows:

[C4:BE:78:A6:09][LE]>
10. Connect the Raspbery Pi device to the SensorTag:

[C4:BE:78:A6:09][LE]>connect
Following are the set of messages you will get to see, as the connect operation is being performed, to pair up the TI Sensor Tag and the Raspberry Pi device:

Attempting to connect to C4:BE:78:A6: 09

Connection successful

[C4:BE:78:A6:09][LE]>

If you do not get a connection issue the following command

sudo hciconfig hci0 reset

Then reissue

sudo gatttool -b xx:xx:xx:xx:xx:xx --interactive

Retrieving Temperature from SensorTag on to Raspberry Pi

The TI Sensor Tag includes 10 low-power MEMS sensors (light, digital microphone, magnetic sensor, humidity, pressure, accelerometer, gyroscope, magnetometer, object temperature, and ambient temperature). To minimize the scope of this recipe, we shall work on retrieving the Temperature readings from the TI Sensor Tag

To retrieve temperature data onto your Raspberry Pi, you should enable the temperature sensor(s) on TI CC2650, so that it starts measuring the temperature. This data or the reading is held in a temperature designated handle and you need to read it from this handle.

Think of a handle as a connection endpoint, to one of the many services offered by the bluetooth device. For instance, TI CC2650 has 10 different handles, one each for each of the MEMS sensors mentioned above.

11. Enable the Temperature Sensor(s), by issuing the command as follows:

char-write-cmd 0x24 01

This activates the temperature sensors on TI CC2650, which were in standby mode

12. Now read the temperature data in hexadecimal values from this handle

 char-read-hnd 0x21
You should see both IR and Ambient Temperature outputs in Hexadecimal (Hex) format:

Characteristic value/descriptor: 50 09 e4 0b
Note: The handles specified in the read and write above are for the TI CC2650 SensorTag only.
Convert Temperature from Hex to Celsius and Fahrenheit

Convert the temperatures from Hex to Degree Celsius and Fahrenheit using the appropriate conversion factor. For your convenience, the conversion of temperature from Hex to Degree Celsius and Fahrenheit has been demonstrated using a Python script.

13. For the TI CC2650, open a Python shell and execute the following set of lines:

raw_temp_data = '50 09 e4 0b' # Start with raw data from SensorTag

raw_temp_bytes = raw_temp_data.split() # Split into individual bytes

raw_ambient_temp = int( '0x'+ raw_temp_bytes[3]+ raw_temp_bytes[2], 16) # Choose ambient temperature (reverse bytes for little endian)

ambient_temp_int = raw_ambient_temp >> 2 & 0x3FFF # Shift right, based on from TI

ambient_temp_celsius = float(ambient_temp_int) * 0.03125 # Convert to Celsius based on info from TI

ambient_temp_fahrenheit = (ambient_temp_celsius * 1.8) + 32 # Convert to Fahrenheit

14. Printing the values for the parameters ambient_temp_celsius and ambient_temp_fahrenheit, shall display the temperature readings for you:

print ambient_temp_celsius

print ambient_temp_fahrenheit

##############################

NEXT STEPS = Provide more information on the Tag = Install Bluey

$ sudo apt-get install python-pip libglib2.0-dev
$ sudo pip install bluepy
To install the source and build locally:

$ sudo apt-get install git build-essential libglib2.0-dev
$ git clone https://github.com/IanHarvey/bluepy.git
$ cd bluepy
$ python setup.py build
$ python setup.py install

To read now sensor data from the sensortag, use the example script sensortag.py:
usage: sensortag.py [-h] [-n COUNT] [-t T] [-T] [-A] [-H] [-M] [-B] [-G] [-K]
[--all]
host

positional arguments:
host MAC of BT device

optional arguments:
-h, --help show this help message and exit
-n COUNT Number of times to loop data
-t T time between polling
-T, --temperature
-A, --accelerometer
-H, --humidity
-M, --magnetometer
-B, --barometer
-G, --gyroscope
-K, --keypress
--all

I.e. to read the temperature five times in an interval of 0.5 seconds we use:
python sensortag.py BC:6A:29:AC:53:D1 -n 5 -t 0.5 -T
then press the button on the side of the sensortag
Connecting to BC:6A:29:AC:53:D1
('Temp: ', (31.71875, 30.4396374686782))
('Temp: ', (31.75, 28.29441505369789))
('Temp: ', (31.71875, 27.21886394070981))
('Temp: ', (31.71875, 27.21886394070981))
('Temp: ', (31.71875, 28.54570004702458))

It is also possible (without any changes to the sensortag.py-script) to use it as a python script:
import time
import sensortag

tag = sensortag.SensorTag('BC:6A:29:AC:53:D1')

time.sleep(1.0)
tag.IRtemperature.enable()
for i in range(5):
tag.waitForNotifications(1.0)
print tag.IRtemperature.read()
tag.disconnect()
del tag

One remark if you want to import the module from another folder I recommend adding to the __init__.py file the line:
from . import *
Than it is possible to import the package with realtive importing like:
from bluepy.bluepy import sensortag
