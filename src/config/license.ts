import { ILicenseConfig } from "../interfaces/ILicenseConfig";
import { StatusEnum } from "../interfaces/StatusEnum";

let LicenseConfig : ILicenseConfig = {

    onNolicense: StatusEnum.Warning,
    onNotFound: StatusEnum.Success,
    
    // By default this only allows licenses which are compatible with MIT and similiar
    // modify to suit your needs.
    onlyAllow: [
      'AFL-2.1',      'AFL-3.0',      'APSL-2.0',     'Apache-1.1',   'Apache-2.0',
      'Artistic-1.0', 'Artistic-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'BSL-1.0',
      'CC-BY-1.0',    'CC-BY-2.0',    'CC-BY-2.5',    'CC-BY-3.0',    'CC-BY-4.0',
      'CC0-1.0',      'CDDL-1.0',     'CDDL-1.1',     'CPL-1.0',      'EPL-1.0',
      'FTL',          'IPL-1.0',      'ISC',          'LGPL-2.0',     'LGPL-2.1',
      'LGPL-3.0',     'LPL-1.02',     'MIT',          'MPL-1.0',      'MPL-1.1',
      'MPL-2.0',      'MS-PL',        'NCSA',         'OpenSSL',      'PHP-3.0',
      'Ruby',         'Unlicense',    'W3C',          'Xnet',         'ZPL-2.0',
      'Zend-2.0',     'Zlib',         'libtiff'
    ],

    // use a ban approach 
    exclude: undefined
};

export { LicenseConfig };
