const { readFileSync, writeFileSync } = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const ver = '0.1'
const metadataRegex = /\$\$\$Metadata@encoding=(...*?)@Date=(...*?)@version=(...*?)\$\$\$/gm
const rawDataRegex = /(?<=--------------------File Code--------------------\n).*/gm
commandLineInput()

function commandLineInput() {
    readline.question('File2Dox >', (command) => {
        const tokens = command.split(' ')
        switch (tokens[0]) {
            case "help": {
                console.log('---Help Menu---')
                break;
            }
            case "exit": {
                process.exit()
            }
            case "decode": {
                if ((tokens.length - 1) != 2) {
                    console.log(tokens.length)
                    console.log('----Invalid Use----')
                    console.log('decode [input] [output]')
                }
                const file = readFileSync(tokens[1], 'ascii')
                const metadataArray = metadataRegex.exec(file.match(metadataRegex)[0]).slice(1,4)
                const metadata = {
                    encoding: metadataArray[0],
                    date: metadataArray[1],
                    version: metadataArray[2],
                }
                const rawData = rawDataRegex.exec(file)[0];
                if (ver != metadata.version){
                    process.stdout.write("\r[WARN] File Version Not Equal\n");
                    process.stdout.write("\r       The Version Listed In The File You Are Trying To Decode Is Not Equal To The Version Your Running. This Shouldn't create problems enless WaterWolf adds new encoding options 💀.\n");
                }
                const buffer = Buffer.from(rawData, metadata.encoding);
                process.stdout.write("Writing Text Data to File");
                try {
                    writeFileSync(tokens[2], buffer)
                    process.stdout.write("\r[OK] Writing Text Data to File\n");
                } catch (err) {
                    process.stdout.write("\r[FAIL] Writing Text Data to File\n");
                    process.stdout.write(`\r       ${err}\n`);
                    break;
                }
                break
            }
            case "encode": {
                if ((tokens.length - 1) != 3) {
                    console.log('----Invalid Use----')
                    console.log('encode [input] [output] <encoding>')
                    break
                }


                const filePart = readFileSync(tokens[1], tokens[3])
                process.stdout.write("Checking File Size");
                if (filePart.length >= 999000) {
                    process.stdout.write('\r[FAIL] Checking File Size\n')
                    process.stdout.write('\r       File size falls outside the support size 999,000chars.\n')
                    break
                }
                const text =
                    `$$$Metadata@encoding=${tokens[3]}@Date=${Date.now()}@version=${ver}$$$
------File To DOX------

All text below the line contains a File encoded use the program below to decode and view the File

----NodeJS Code----
all code inside this box is nodejs code.
~~~

~~~

----Read Me----
To use this program copy the code above into a file called index.js then create a new file called out.txt and copy and paste all the text under the line into the text file, save the file and exit, after that open a terminal to where you have the files located and run "node ./index.js" and you should get a File called out.jpg




--------------------File Code--------------------\n`
                const file = text + filePart
                process.stdout.write("\r[OK] Checking File Size\n");
                process.stdout.write("\rWriting Data to Text File");
                try {
                    writeFileSync(tokens[2], file)
                    process.stdout.write("\r[OK] Writing Data to Text File\n");
                } catch (err) {
                    process.stdout.write("\r[FAIL] Writing Data to Text File\n");
                    process.stdout.write(`\r       ${err}\n`);
                    break;
                }
                console.log(`Size: ${filePart.length} / 999,000 | ${filePart.length >= 999000}`)
            }
        }
        commandLineInput()
    });
}

