import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening at port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
start();
//# sourceMappingURL=server.js.map