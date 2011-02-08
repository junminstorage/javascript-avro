package driver;

import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Iterator;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 *
 * @author terencey
 */
public class Driver {

    public static void main(String[] args) throws ScriptException, IOException {
        if (args.length < 2) {
            System.err.println("Usage: java Driver [path/to/avro.js] [test/case/dir]");
            return;
        }

        File testDir = new File(args[1]);
        File[] testFiles = testDir.listFiles(new FileFilter() {

            @Override
            public boolean accept(File file) {
                return (file.isFile() && file.getName().endsWith(".js"));
            }

        });
        if (testFiles == null) {
            System.err.println(String.format("Error: Unable to read test case directory %s", args[1]));
            return;
        }

        for (File testFile : testFiles) {
            ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("javascript");
            Reader reader = new MultiFileReader(new File(args[0]), testFile);

            scriptEngine.eval(reader);
            reader.close();
        }
    }

    private static final class MultiFileReader extends Reader {

        private final Iterator<File> files;
        private Reader currentReader;

        public MultiFileReader(final File file, final File...files) {
            this.files = new Iterator<File>() {

                int idx = -1;

                @Override
                public boolean hasNext() {
                    return idx < files.length;
                }

                @Override
                public File next() {
                    if (idx < 0) {
                        idx++;
                        return file;
                    } else {
                        return files[idx++];
                    }
                }

                @Override
                public void remove() {
                    throw new UnsupportedOperationException("Not supported yet.");
                }
            };
        }

        @Override
        public int read(char[] cbuf, int off, int len) throws IOException {
            int readLen = -1;
           
            while (readLen < 0) {
                if (currentReader == null) {
                    if (!files.hasNext()) {
                        return -1;
                    }
                    currentReader = new FileReader(files.next());
                }

                readLen = currentReader.read(cbuf, off, len);

                if (readLen < 0) {
                    currentReader.close();
                    currentReader = null;
                }
            }

            return readLen;
        }

        @Override
        public void close() throws IOException {
            if (currentReader != null) {
                currentReader.close();
            }
        }
    }

    private Driver() {
    }
}
