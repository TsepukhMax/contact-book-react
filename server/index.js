    import express from 'express';
    import { dirname } from 'path';
    import { fileURLToPath } from 'url';
    import fs from 'fs';

    const port = 8080;
    const app = express();

    app.use(express.json());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // або '*', якщо немає credentials
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    
        if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
        }
    
        next();
    });

    const dbPath = dirname(fileURLToPath(import.meta.url)) + '/db.json';

    const writeDb = (content) => {
        fs.writeFile(dbPath, JSON.stringify(content), null, () => {});
    };

    const performDbAction = (action) => {
        fs.readFile(dbPath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                const emptyDbContent = [];
                writeDb(emptyDbContent);
                action(emptyDbContent);
            } else {
                action(JSON.parse(data));
            }
        });
    }

    app.get('/contacts', (_req, res) => {
        performDbAction((data) => res.json(data.map((c) => ({ id: c.id, firstName: c.firstName, lastName: c.lastName }))));
    });

    app.get('/contacts/:id', (req, res) => {
        const contactId = Number(req.params.id);

        performDbAction((data) => {
            const contact = data.find(c => c.id === contactId);

            if (!contact) {
                res.status(404).json({ errorMessage: 'Contact not found' });
                return;
            }

            res.json(contact);
        });
    });

    app.post('/contacts', (req, res) => {
        const contact = req.body.contact;

        if (!isContactValid(contact)) {
            res.status(400).json({ errorMessage: 'Some required field is missed' });
            return;
        }

        performDbAction((data) => {
            contact.id = Date.now();
            data.push(contact);
            writeDb(data);
            res.json(contact.id);
        });
    });

    app.put('/contacts/:id', (req, res) => {
        const contactId = Number(req.params.id);

        performDbAction((data) => {
            const contactIndex = data.findIndex(c => c.id === contactId);

            if (contactIndex === -1) {
                res.status(400).json({ errorMessage: 'Contact does not exist' });
                return;
            }

            const contact = req.body.contact;

            if (!isContactValid(contact)) {
                res.status(400).json({ errorMessage: 'Some required field is missed' });
                return;
            }

            contact.id = contactId;
            data[contactIndex] = contact;
            writeDb(data);

            res.json(contact.id);
        });
    });

    app.delete('/contacts/:id', (req, res) => {
        const contactId = Number(req.params.id);

        performDbAction((data) => {
            if (!data.some(c => c.id === contactId)) {
                res.status(400).json({ errorMessage: 'Contact does not exist' });
                return;
            }

            writeDb(data.filter(c => c.id !== contactId));

            res.json({});
        });
    });

    const isContactValid = (contact) => contact?.firstName?.length > 1;

    app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
