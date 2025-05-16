import * as fs from 'fs';
import * as ini from 'ini';
import * as yaml from 'js-yaml';

export class Config {

    public static read(path: string): any {
        if (!fs.existsSync(path)) {
            throw new Error(`File not found: ${path}`);
        }

        const data = fs.readFileSync(path, 'utf-8');
        const extension = path.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'json':
                return JSON.parse(data);

            case 'ini':
                return ini.parse(data);

            case 'yaml':
            case 'yml':
                return yaml.load(data);

            default:
                throw new Error(`Unsupported config type: .${extension}`);
        }
    }

}