import { IconType } from 'react-icons'
import {
  FaFileAlt,
  FaFileArchive,
  FaFileAudio,
  FaFileCode,
  FaFileCsv,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaFolder,
  FaFolderOpen,
  FaDatabase,
  FaMarkdown,
  FaCog,
  FaFont,
  FaBook,
  FaLock,
  FaCubes,
  FaTerminal,
} from 'react-icons/fa'
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiC,
  SiGo,
  SiRust,
  SiRuby,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiDart,
  SiLua,
  SiPerl,
  SiR,
  SiScala,
  SiHaskell,
  SiElixir,
  SiJulia,
  SiVuedotjs,
  SiReact,
  SiAngular,
  SiSvelte,
  SiHtml5,
  SiCss3,
  SiSass,
  SiLess,
  SiNodedotjs,
  SiDeno,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiJson,
  SiYaml,
  SiToml,
  SiGraphql,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiApache,
  SiNginx,
  SiWebpack,
  SiVite,
  SiEslint,
  SiPrettier,
  SiJest,
  SiMocha,
  SiCypress,
  SiSelenium,
  SiSublimetext,
  SiIntellijidea,
  SiAndroidstudio,
  SiXcode,
  SiUnity,
  SiUnrealengine,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiAdobeaftereffects,
  SiFigma,
  SiSketch,
  SiCanva,
  SiBlender,
  SiAudacity,
  SiZig,
  SiNim,
  SiOcaml,
  SiFortran,
  SiAssemblyscript,
  SiWebassembly,
  SiTerraform,
  SiAnsible,
  SiGnu,
  SiLinux,
  SiApple,
  SiAndroid,
} from 'react-icons/si'
import {
  BiLogoJavascript,
  BiLogoTypescript,
  BiLogoPython,
  BiLogoJava,
} from 'react-icons/bi'
import {
  VscJson,
  VscMarkdown,
  VscFile,
  VscFileCode,
  VscFileBinary,
  VscFileMedia,
  VscFileZip,
  VscFilePdf,
  VscTerminal,
  VscGear,
  VscLock,
  VscKey,
  VscDatabase,
  VscTable,
  VscSymbolClass,
  VscSymbolInterface,
  VscTextSize,
} from 'react-icons/vsc'
import {
  AiFillFileExcel,
  AiFillFileImage,
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileText,
  AiFillFileWord,
  AiFillFileZip,
  AiFillFile,
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFile,
} from 'react-icons/ai'
import { BsFiletypeExe, BsFileEarmarkMusic, BsFileEarmarkPlay } from 'react-icons/bs'
import { DiRuby } from 'react-icons/di'
import { TbBrandCpp, TbFileTypeXml } from 'react-icons/tb'

export interface IconMapping {
  icon: IconType
  color: string
}

export interface FileIconPattern {
  pattern: RegExp
  icon: IconType
  color: string
}

const extensionMappings: Record<string, IconMapping> = {
  // JavaScript/TypeScript
  '.js': { icon: SiJavascript, color: 'text-yellow-500' },
  '.jsx': { icon: SiReact, color: 'text-cyan-500' },
  '.ts': { icon: SiTypescript, color: 'text-blue-600' },
  '.tsx': { icon: SiReact, color: 'text-cyan-600' },
  '.mjs': { icon: SiJavascript, color: 'text-yellow-500' },
  '.cjs': { icon: SiNodedotjs, color: 'text-green-600' },
  
  // Web Technologies
  '.html': { icon: SiHtml5, color: 'text-orange-600' },
  '.htm': { icon: SiHtml5, color: 'text-orange-600' },
  '.css': { icon: SiCss3, color: 'text-blue-500' },
  '.scss': { icon: SiSass, color: 'text-pink-500' },
  '.sass': { icon: SiSass, color: 'text-pink-500' },
  '.less': { icon: SiLess, color: 'text-indigo-600' },
  '.vue': { icon: SiVuedotjs, color: 'text-green-500' },
  '.svelte': { icon: SiSvelte, color: 'text-orange-500' },
  
  // Python
  '.py': { icon: SiPython, color: 'text-blue-400' },
  '.pyw': { icon: SiPython, color: 'text-blue-400' },
  '.pyx': { icon: SiPython, color: 'text-blue-400' },
  '.pyd': { icon: SiPython, color: 'text-blue-400' },
  '.pyc': { icon: SiPython, color: 'text-blue-300' },
  '.pyo': { icon: SiPython, color: 'text-blue-300' },
  
  // Java/JVM
  '.java': { icon: VscFileCode, color: 'text-red-600' },
  '.class': { icon: VscFileCode, color: 'text-red-500' },
  '.jar': { icon: VscFileZip, color: 'text-red-600' },
  '.kt': { icon: SiKotlin, color: 'text-purple-600' },
  '.kts': { icon: SiKotlin, color: 'text-purple-600' },
  '.scala': { icon: SiScala, color: 'text-red-700' },
  '.groovy': { icon: FaFileCode, color: 'text-teal-600' },
  
  // C/C++
  '.c': { icon: SiC, color: 'text-blue-700' },
  '.h': { icon: SiC, color: 'text-blue-600' },
  '.cpp': { icon: SiCplusplus, color: 'text-blue-700' },
  '.cc': { icon: SiCplusplus, color: 'text-blue-700' },
  '.cxx': { icon: SiCplusplus, color: 'text-blue-700' },
  '.hpp': { icon: SiCplusplus, color: 'text-blue-600' },
  '.hxx': { icon: SiCplusplus, color: 'text-blue-600' },
  
  // C#/.NET
  '.cs': { icon: VscFileCode, color: 'text-purple-700' },
  '.vb': { icon: VscFileCode, color: 'text-purple-600' },
  '.fs': { icon: VscFileCode, color: 'text-blue-500' },
  '.fsx': { icon: VscFileCode, color: 'text-blue-500' },
  
  // Go
  '.go': { icon: SiGo, color: 'text-cyan-600' },
  '.mod': { icon: SiGo, color: 'text-cyan-500' },
  
  // Rust
  '.rs': { icon: SiRust, color: 'text-orange-700' },
  '.rlib': { icon: SiRust, color: 'text-orange-600' },
  
  // Ruby
  '.rb': { icon: SiRuby, color: 'text-red-500' },
  '.erb': { icon: SiRuby, color: 'text-red-400' },
  '.rake': { icon: SiRuby, color: 'text-red-500' },
  
  // PHP
  '.php': { icon: SiPhp, color: 'text-purple-500' },
  '.phtml': { icon: SiPhp, color: 'text-purple-500' },
  
  // Swift
  '.swift': { icon: SiSwift, color: 'text-orange-500' },
  
  // Dart/Flutter
  '.dart': { icon: SiDart, color: 'text-blue-500' },
  
  // Lua
  '.lua': { icon: SiLua, color: 'text-blue-600' },
  
  // Shell Scripts
  '.sh': { icon: FaTerminal, color: 'text-gray-600' },
  '.bash': { icon: VscTerminal, color: 'text-gray-600' },
  '.zsh': { icon: FaTerminal, color: 'text-gray-600' },
  '.fish': { icon: FaTerminal, color: 'text-gray-600' },
  '.ps1': { icon: VscTerminal, color: 'text-blue-600' },
  '.psm1': { icon: VscTerminal, color: 'text-blue-600' },
  '.psd1': { icon: VscTerminal, color: 'text-blue-600' },
  '.bat': { icon: VscTerminal, color: 'text-gray-500' },
  '.cmd': { icon: VscTerminal, color: 'text-gray-500' },
  
  // Data/Config Files
  '.json': { icon: VscJson, color: 'text-yellow-600' },
  '.jsonc': { icon: VscJson, color: 'text-yellow-600' },
  '.json5': { icon: VscJson, color: 'text-yellow-600' },
  '.xml': { icon: TbFileTypeXml, color: 'text-orange-600' },
  '.yaml': { icon: SiYaml, color: 'text-red-500' },
  '.yml': { icon: SiYaml, color: 'text-red-500' },
  '.toml': { icon: SiToml, color: 'text-gray-600' },
  '.ini': { icon: VscGear, color: 'text-gray-500' },
  '.cfg': { icon: VscGear, color: 'text-gray-500' },
  '.conf': { icon: VscGear, color: 'text-gray-500' },
  '.config': { icon: VscGear, color: 'text-gray-500' },
  '.env': { icon: VscGear, color: 'text-yellow-600' },
  '.env.local': { icon: VscGear, color: 'text-yellow-600' },
  '.env.development': { icon: VscGear, color: 'text-yellow-600' },
  '.env.production': { icon: VscGear, color: 'text-yellow-600' },
  
  // Database
  '.sql': { icon: VscDatabase, color: 'text-blue-500' },
  '.db': { icon: VscDatabase, color: 'text-gray-600' },
  '.sqlite': { icon: VscDatabase, color: 'text-blue-600' },
  '.sqlite3': { icon: VscDatabase, color: 'text-blue-600' },
  '.mdb': { icon: VscDatabase, color: 'text-red-600' },
  '.accdb': { icon: VscDatabase, color: 'text-red-600' },
  
  // Documents
  '.md': { icon: VscMarkdown, color: 'text-gray-700' },
  '.markdown': { icon: VscMarkdown, color: 'text-gray-700' },
  '.mdx': { icon: VscMarkdown, color: 'text-gray-700' },
  '.rst': { icon: FaFileAlt, color: 'text-gray-600' },
  '.txt': { icon: VscFile, color: 'text-gray-500' },
  '.rtf': { icon: FaFileAlt, color: 'text-gray-600' },
  '.doc': { icon: FaFileWord, color: 'text-blue-700' },
  '.docx': { icon: FaFileWord, color: 'text-blue-700' },
  '.odt': { icon: FaFileWord, color: 'text-blue-600' },
  '.pdf': { icon: FaFilePdf, color: 'text-red-600' },
  '.tex': { icon: VscFileCode, color: 'text-green-600' },
  '.latex': { icon: VscFileCode, color: 'text-green-600' },
  
  // Spreadsheets
  '.xls': { icon: FaFileExcel, color: 'text-green-700' },
  '.xlsx': { icon: FaFileExcel, color: 'text-green-700' },
  '.xlsm': { icon: FaFileExcel, color: 'text-green-700' },
  '.csv': { icon: FaFileCsv, color: 'text-green-600' },
  '.tsv': { icon: VscTable, color: 'text-green-600' },
  '.ods': { icon: FaFileExcel, color: 'text-green-600' },
  
  // Presentations
  '.ppt': { icon: FaFilePowerpoint, color: 'text-orange-600' },
  '.pptx': { icon: FaFilePowerpoint, color: 'text-orange-600' },
  '.odp': { icon: FaFilePowerpoint, color: 'text-orange-500' },
  
  // Images
  '.jpg': { icon: FaFileImage, color: 'text-blue-500' },
  '.jpeg': { icon: FaFileImage, color: 'text-blue-500' },
  '.png': { icon: FaFileImage, color: 'text-blue-500' },
  '.gif': { icon: FaFileImage, color: 'text-purple-500' },
  '.bmp': { icon: FaFileImage, color: 'text-blue-500' },
  '.svg': { icon: FaFileImage, color: 'text-yellow-500' },
  '.webp': { icon: FaFileImage, color: 'text-blue-500' },
  '.ico': { icon: FaFileImage, color: 'text-blue-600' },
  '.tif': { icon: FaFileImage, color: 'text-blue-500' },
  '.tiff': { icon: FaFileImage, color: 'text-blue-500' },
  '.heic': { icon: FaFileImage, color: 'text-purple-500' },
  '.heif': { icon: FaFileImage, color: 'text-purple-500' },
  '.avif': { icon: FaFileImage, color: 'text-green-500' },
  '.raw': { icon: FaFileImage, color: 'text-gray-600' },
  '.dng': { icon: FaFileImage, color: 'text-orange-600' },
  '.cr2': { icon: FaFileImage, color: 'text-red-600' },
  '.cr3': { icon: FaFileImage, color: 'text-red-600' },
  '.nef': { icon: FaFileImage, color: 'text-yellow-600' },
  '.arw': { icon: FaFileImage, color: 'text-orange-500' },
  '.orf': { icon: FaFileImage, color: 'text-blue-600' },
  '.rw2': { icon: FaFileImage, color: 'text-green-600' },
  
  // Design Files
  '.psd': { icon: SiAdobephotoshop, color: 'text-blue-600' },
  '.ai': { icon: SiAdobeillustrator, color: 'text-orange-600' },
  '.eps': { icon: SiAdobeillustrator, color: 'text-orange-500' },
  '.indd': { icon: FaFileImage, color: 'text-pink-600' },
  '.xd': { icon: FaFileImage, color: 'text-purple-600' },
  '.fig': { icon: SiFigma, color: 'text-purple-500' },
  '.sketch': { icon: SiSketch, color: 'text-yellow-500' },
  
  // Video
  '.mp4': { icon: FaFileVideo, color: 'text-purple-500' },
  '.avi': { icon: FaFileVideo, color: 'text-purple-500' },
  '.mkv': { icon: FaFileVideo, color: 'text-purple-500' },
  '.mov': { icon: FaFileVideo, color: 'text-purple-500' },
  '.wmv': { icon: FaFileVideo, color: 'text-purple-500' },
  '.flv': { icon: FaFileVideo, color: 'text-purple-500' },
  '.webm': { icon: FaFileVideo, color: 'text-purple-500' },
  '.m4v': { icon: FaFileVideo, color: 'text-purple-500' },
  '.mpg': { icon: FaFileVideo, color: 'text-purple-500' },
  '.mpeg': { icon: FaFileVideo, color: 'text-purple-500' },
  '.3gp': { icon: FaFileVideo, color: 'text-purple-500' },
  '.3g2': { icon: FaFileVideo, color: 'text-purple-500' },
  '.f4v': { icon: FaFileVideo, color: 'text-purple-500' },
  '.m2ts': { icon: FaFileVideo, color: 'text-purple-500' },
  '.mts': { icon: FaFileVideo, color: 'text-purple-500' },
  '.vob': { icon: FaFileVideo, color: 'text-purple-500' },
  
  // Audio
  '.mp3': { icon: FaFileAudio, color: 'text-green-500' },
  '.wav': { icon: FaFileAudio, color: 'text-green-500' },
  '.flac': { icon: FaFileAudio, color: 'text-green-500' },
  '.aac': { icon: FaFileAudio, color: 'text-green-500' },
  '.ogg': { icon: FaFileAudio, color: 'text-green-500' },
  '.wma': { icon: FaFileAudio, color: 'text-green-500' },
  '.m4a': { icon: FaFileAudio, color: 'text-green-500' },
  '.opus': { icon: FaFileAudio, color: 'text-green-500' },
  '.aiff': { icon: FaFileAudio, color: 'text-green-500' },
  '.ape': { icon: FaFileAudio, color: 'text-green-500' },
  '.alac': { icon: FaFileAudio, color: 'text-green-500' },
  '.dts': { icon: FaFileAudio, color: 'text-green-500' },
  '.ac3': { icon: FaFileAudio, color: 'text-green-500' },
  '.amr': { icon: FaFileAudio, color: 'text-green-500' },
  
  // Archives
  '.zip': { icon: FaFileArchive, color: 'text-yellow-600' },
  '.rar': { icon: FaFileArchive, color: 'text-yellow-600' },
  '.7z': { icon: FaFileArchive, color: 'text-yellow-600' },
  '.tar': { icon: FaFileArchive, color: 'text-gray-600' },
  '.gz': { icon: FaFileArchive, color: 'text-gray-600' },
  '.bz2': { icon: FaFileArchive, color: 'text-gray-600' },
  '.xz': { icon: FaFileArchive, color: 'text-gray-600' },
  '.tgz': { icon: FaFileArchive, color: 'text-gray-600' },
  '.tbz2': { icon: FaFileArchive, color: 'text-gray-600' },
  '.cab': { icon: FaFileArchive, color: 'text-yellow-600' },
  '.iso': { icon: FaFileArchive, color: 'text-red-600' },
  '.dmg': { icon: FaFileArchive, color: 'text-gray-700' },
  '.pkg': { icon: FaFileArchive, color: 'text-orange-600' },
  '.deb': { icon: FaFileArchive, color: 'text-red-600' },
  '.rpm': { icon: FaFileArchive, color: 'text-red-600' },
  
  // Executables
  '.exe': { icon: BsFiletypeExe, color: 'text-blue-600' },
  '.msi': { icon: BsFiletypeExe, color: 'text-blue-600' },
  '.app': { icon: BsFiletypeExe, color: 'text-gray-700' },
  '.apk': { icon: SiAndroid, color: 'text-green-500' },
  '.ipa': { icon: SiApple, color: 'text-gray-700' },
  '.appx': { icon: VscFileZip, color: 'text-blue-600' },
  '.appxbundle': { icon: VscFileZip, color: 'text-blue-600' },
  
  // System Files
  '.dll': { icon: VscFileBinary, color: 'text-gray-600' },
  '.so': { icon: VscFileBinary, color: 'text-gray-600' },
  '.dylib': { icon: VscFileBinary, color: 'text-gray-600' },
  '.lib': { icon: VscFileBinary, color: 'text-gray-600' },
  '.sys': { icon: VscGear, color: 'text-gray-700' },
  '.drv': { icon: VscGear, color: 'text-gray-700' },
  
  // Font Files
  '.ttf': { icon: FaFont, color: 'text-gray-700' },
  '.otf': { icon: FaFont, color: 'text-gray-700' },
  '.woff': { icon: FaFont, color: 'text-gray-700' },
  '.woff2': { icon: FaFont, color: 'text-gray-700' },
  '.eot': { icon: FaFont, color: 'text-gray-700' },
  
  // Security
  '.cer': { icon: VscLock, color: 'text-green-600' },
  '.crt': { icon: VscLock, color: 'text-green-600' },
  '.pem': { icon: VscLock, color: 'text-green-600' },
  '.key': { icon: VscKey, color: 'text-yellow-600' },
  '.pub': { icon: VscKey, color: 'text-blue-600' },
  '.gpg': { icon: VscLock, color: 'text-red-600' },
  '.pgp': { icon: VscLock, color: 'text-red-600' },
  
  // Build Files
  '.gradle': { icon: VscFileCode, color: 'text-green-600' },
  '.maven': { icon: VscFileCode, color: 'text-red-600' },
  '.ant': { icon: VscFileCode, color: 'text-red-500' },
  '.make': { icon: VscFileCode, color: 'text-gray-600' },
  '.cmake': { icon: VscFileCode, color: 'text-blue-600' },
  
  // Other Languages
  '.r': { icon: SiR, color: 'text-blue-600' },
  '.R': { icon: SiR, color: 'text-blue-600' },
  '.jl': { icon: SiJulia, color: 'text-purple-600' },
  '.ex': { icon: SiElixir, color: 'text-purple-700' },
  '.exs': { icon: SiElixir, color: 'text-purple-700' },
  '.erl': { icon: VscFileCode, color: 'text-red-700' },
  '.hrl': { icon: VscFileCode, color: 'text-red-600' },
  '.nim': { icon: SiNim, color: 'text-yellow-600' },
  '.v': { icon: VscFileCode, color: 'text-blue-700' },
  '.vala': { icon: VscFileCode, color: 'text-purple-600' },
  '.zig': { icon: SiZig, color: 'text-orange-600' },
  '.ml': { icon: SiOcaml, color: 'text-orange-600' },
  '.mli': { icon: SiOcaml, color: 'text-orange-500' },
  '.fsi': { icon: VscFileCode, color: 'text-blue-500' },
  '.clj': { icon: VscFileCode, color: 'text-green-600' },
  '.cljs': { icon: VscFileCode, color: 'text-green-600' },
  '.elm': { icon: VscFileCode, color: 'text-blue-600' },
  '.purs': { icon: VscFileCode, color: 'text-gray-700' },
  '.hs': { icon: SiHaskell, color: 'text-purple-700' },
  '.lhs': { icon: SiHaskell, color: 'text-purple-600' },
  '.rkt': { icon: VscFileCode, color: 'text-red-600' },
  '.scm': { icon: VscFileCode, color: 'text-red-500' },
  '.lisp': { icon: VscFileCode, color: 'text-gray-600' },
  '.el': { icon: VscFileCode, color: 'text-purple-600' },
  '.vim': { icon: VscFileCode, color: 'text-green-600' },
  '.vimrc': { icon: VscFileCode, color: 'text-green-600' },
  '.pl': { icon: SiPerl, color: 'text-blue-600' },
  '.pm': { icon: SiPerl, color: 'text-blue-600' },
  '.awk': { icon: VscFileCode, color: 'text-gray-600' },
  '.sed': { icon: VscFileCode, color: 'text-gray-600' },
  '.f': { icon: SiFortran, color: 'text-purple-600' },
  '.f90': { icon: SiFortran, color: 'text-purple-600' },
  '.f95': { icon: SiFortran, color: 'text-purple-600' },
  '.for': { icon: SiFortran, color: 'text-purple-600' },
  '.pas': { icon: VscFileCode, color: 'text-blue-700' },
  '.pp': { icon: VscFileCode, color: 'text-blue-600' },
  '.ada': { icon: VscFileCode, color: 'text-green-700' },
  '.adb': { icon: VscFileCode, color: 'text-green-600' },
  '.ads': { icon: VscFileCode, color: 'text-green-600' },
  '.d': { icon: VscFileCode, color: 'text-red-600' },
  '.di': { icon: VscFileCode, color: 'text-red-500' },
  '.cr': { icon: VscFileCode, color: 'text-gray-700' },
  '.coffee': { icon: VscFileCode, color: 'text-brown-600' },
  '.litcoffee': { icon: VscFileCode, color: 'text-brown-500' },
  '.hack': { icon: VscFileCode, color: 'text-orange-600' },
  '.hh': { icon: VscFileCode, color: 'text-orange-500' },
  
  // Assembly
  '.asm': { icon: SiAssemblyscript, color: 'text-red-700' },
  '.s': { icon: SiAssemblyscript, color: 'text-red-600' },
  '.S': { icon: SiAssemblyscript, color: 'text-red-600' },
  '.wasm': { icon: SiWebassembly, color: 'text-purple-600' },
  '.wat': { icon: SiWebassembly, color: 'text-purple-500' },
  
  // Game Development
  '.unity': { icon: SiUnity, color: 'text-gray-700' },
  '.unitypackage': { icon: SiUnity, color: 'text-gray-700' },
  '.uasset': { icon: SiUnrealengine, color: 'text-gray-700' },
  '.umap': { icon: SiUnrealengine, color: 'text-gray-700' },
  '.blend': { icon: SiBlender, color: 'text-orange-600' },
  '.blend1': { icon: SiBlender, color: 'text-orange-500' },
  '.fbx': { icon: VscFileMedia, color: 'text-gray-600' },
  '.obj': { icon: VscFileMedia, color: 'text-gray-600' },
  '.dae': { icon: VscFileMedia, color: 'text-gray-600' },
  '.3ds': { icon: VscFileMedia, color: 'text-gray-600' },
  
  // Log Files
  '.log': { icon: VscFile, color: 'text-gray-500' },
  '.out': { icon: VscFile, color: 'text-gray-500' },
  '.err': { icon: VscFile, color: 'text-red-500' },
}

// Pattern-based mappings for complex file names
export const filePatterns: FileIconPattern[] = [
  // Test files
  { pattern: /\.test\.(js|jsx|ts|tsx)$/, icon: SiJest, color: 'text-orange-600' },
  { pattern: /\.spec\.(js|jsx|ts|tsx)$/, icon: SiJest, color: 'text-orange-600' },
  { pattern: /\.cy\.(js|jsx|ts|tsx)$/, icon: SiCypress, color: 'text-green-600' },
  { pattern: /\.e2e\.(js|jsx|ts|tsx)$/, icon: SiSelenium, color: 'text-green-600' },
  
  // Config files with special names
  { pattern: /^dockerfile$/i, icon: SiDocker, color: 'text-blue-500' },
  { pattern: /^docker-compose/i, icon: SiDocker, color: 'text-blue-500' },
  { pattern: /^makefile$/i, icon: VscFileCode, color: 'text-gray-600' },
  { pattern: /^rakefile$/i, icon: SiRuby, color: 'text-red-500' },
  { pattern: /^gemfile$/i, icon: SiRuby, color: 'text-red-500' },
  { pattern: /^guardfile$/i, icon: SiRuby, color: 'text-red-500' },
  { pattern: /^gulpfile/i, icon: VscFileCode, color: 'text-red-600' },
  { pattern: /^gruntfile/i, icon: VscFileCode, color: 'text-orange-600' },
  { pattern: /^webpack\.config/i, icon: SiWebpack, color: 'text-blue-500' },
  { pattern: /^vite\.config/i, icon: SiVite, color: 'text-purple-500' },
  { pattern: /^rollup\.config/i, icon: VscGear, color: 'text-red-600' },
  { pattern: /^babel\.config/i, icon: VscFileCode, color: 'text-yellow-600' },
  { pattern: /^\.eslintrc/i, icon: SiEslint, color: 'text-purple-600' },
  { pattern: /^\.prettierrc/i, icon: SiPrettier, color: 'text-pink-600' },
  { pattern: /^jest\.config/i, icon: SiJest, color: 'text-orange-600' },
  { pattern: /^karma\.conf/i, icon: VscFileCode, color: 'text-green-600' },
  { pattern: /^angular\.json$/i, icon: SiAngular, color: 'text-red-600' },
  { pattern: /^vue\.config/i, icon: SiVuedotjs, color: 'text-green-500' },
  { pattern: /^nuxt\.config/i, icon: VscFileCode, color: 'text-green-600' },
  { pattern: /^next\.config/i, icon: VscFileCode, color: 'text-gray-700' },
  { pattern: /^gatsby-config/i, icon: VscFileCode, color: 'text-purple-600' },
  { pattern: /^tsconfig/i, icon: SiTypescript, color: 'text-blue-600' },
  { pattern: /^jsconfig/i, icon: SiJavascript, color: 'text-yellow-500' },
  { pattern: /^package\.json$/i, icon: SiNodedotjs, color: 'text-green-600' },
  { pattern: /^package-lock\.json$/i, icon: SiNodedotjs, color: 'text-green-500' },
  { pattern: /^yarn\.lock$/i, icon: VscFileCode, color: 'text-blue-600' },
  { pattern: /^pnpm-lock/i, icon: VscFileCode, color: 'text-orange-600' },
  { pattern: /^composer\.json$/i, icon: SiPhp, color: 'text-purple-500' },
  { pattern: /^composer\.lock$/i, icon: SiPhp, color: 'text-purple-400' },
  { pattern: /^requirements\.txt$/i, icon: SiPython, color: 'text-blue-400' },
  { pattern: /^pipfile$/i, icon: SiPython, color: 'text-blue-400' },
  { pattern: /^pipfile\.lock$/i, icon: SiPython, color: 'text-blue-300' },
  { pattern: /^cargo\.toml$/i, icon: SiRust, color: 'text-orange-700' },
  { pattern: /^cargo\.lock$/i, icon: SiRust, color: 'text-orange-600' },
  { pattern: /^go\.mod$/i, icon: SiGo, color: 'text-cyan-600' },
  { pattern: /^go\.sum$/i, icon: SiGo, color: 'text-cyan-500' },
  { pattern: /^gradle/i, icon: VscFileCode, color: 'text-green-600' },
  { pattern: /^pom\.xml$/i, icon: VscFileCode, color: 'text-red-600' },
  { pattern: /^build\.xml$/i, icon: VscFileCode, color: 'text-red-500' },
  
  // Git files
  { pattern: /^\.gitignore$/i, icon: SiGit, color: 'text-orange-600' },
  { pattern: /^\.gitattributes$/i, icon: SiGit, color: 'text-orange-600' },
  { pattern: /^\.gitmodules$/i, icon: SiGit, color: 'text-orange-600' },
  
  // CI/CD files
  { pattern: /^\.travis\.yml$/i, icon: VscFileCode, color: 'text-red-600' },
  { pattern: /^\.circleci/i, icon: VscFileCode, color: 'text-gray-700' },
  { pattern: /^\.github/i, icon: VscFileCode, color: 'text-gray-700' },
  { pattern: /^\.gitlab-ci/i, icon: VscFileCode, color: 'text-orange-600' },
  { pattern: /^jenkinsfile$/i, icon: VscFileCode, color: 'text-red-600' },
  { pattern: /^bitbucket-pipelines/i, icon: VscFileCode, color: 'text-blue-600' },
  { pattern: /^azure-pipelines/i, icon: VscFileCode, color: 'text-blue-600' },
  
  // Editor configs
  { pattern: /^\.vscode/i, icon: VscGear, color: 'text-blue-600' },
  { pattern: /^\.idea/i, icon: SiIntellijidea, color: 'text-red-600' },
  { pattern: /^\.sublime/i, icon: SiSublimetext, color: 'text-orange-600' },
  { pattern: /^\.editorconfig$/i, icon: VscGear, color: 'text-gray-600' },
  
  // Infrastructure as Code
  { pattern: /\.tf$/i, icon: SiTerraform, color: 'text-purple-600' },
  { pattern: /\.tfvars$/i, icon: SiTerraform, color: 'text-purple-500' },
  { pattern: /\.tfstate/i, icon: SiTerraform, color: 'text-purple-600' },
  { pattern: /ansible/i, icon: SiAnsible, color: 'text-red-600' },
  { pattern: /playbook\.ya?ml$/i, icon: SiAnsible, color: 'text-red-600' },
  
  // Kubernetes
  { pattern: /\.ya?ml$/, icon: SiKubernetes, color: 'text-blue-600' },
  { pattern: /^helmfile/i, icon: SiKubernetes, color: 'text-blue-600' },
  { pattern: /^chart\.ya?ml$/i, icon: SiKubernetes, color: 'text-blue-600' },
  
  // License files
  { pattern: /^license/i, icon: VscLock, color: 'text-green-600' },
  { pattern: /^copying/i, icon: VscLock, color: 'text-green-600' },
  
  // README files
  { pattern: /^readme/i, icon: FaBook, color: 'text-blue-600' },
  { pattern: /^changelog/i, icon: VscFile, color: 'text-gray-600' },
  { pattern: /^contributing/i, icon: VscFile, color: 'text-gray-600' },
  { pattern: /^authors/i, icon: VscFile, color: 'text-gray-600' },
  { pattern: /^contributors/i, icon: VscFile, color: 'text-gray-600' },
  { pattern: /^todo/i, icon: VscFile, color: 'text-yellow-600' },
]

// Default icon for unknown file types
export const defaultFileIcon: IconMapping = {
  icon: VscFile,
  color: 'text-gray-400',
}

// Folder icons
export const folderIcon: IconMapping = {
  icon: FaFolder,
  color: 'text-yellow-600',
}

export const folderOpenIcon: IconMapping = {
  icon: FaFolderOpen,
  color: 'text-yellow-600',
}

// Category mappings for fallback
export const categoryMappings = {
  programming: {
    extensions: ['.js', '.ts', '.py', '.java', '.cpp', '.cs', '.go', '.rs', '.rb', '.php'],
    icon: FaFileCode,
    color: 'text-blue-600',
  },
  document: {
    extensions: ['.doc', '.docx', '.pdf', '.txt', '.md', '.rtf'],
    icon: FaFileAlt,
    color: 'text-gray-600',
  },
  spreadsheet: {
    extensions: ['.xls', '.xlsx', '.csv', '.tsv'],
    icon: FaFileExcel,
    color: 'text-green-600',
  },
  presentation: {
    extensions: ['.ppt', '.pptx', '.odp'],
    icon: FaFilePowerpoint,
    color: 'text-orange-600',
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.webp', '.heic', '.heif'],
    icon: FaFileImage,
    color: 'text-blue-500',
  },
  video: {
    extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'],
    icon: FaFileVideo,
    color: 'text-purple-500',
  },
  audio: {
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
    icon: FaFileAudio,
    color: 'text-green-500',
  },
  archive: {
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
    icon: FaFileArchive,
    color: 'text-yellow-600',
  },
}

// Get icon for a file based on its extension and name
export function getFileIconMapping(filename: string, extension: string): IconMapping {
  // First, check direct extension mapping
  const extLower = extension.toLowerCase()
  if (extensionMappings[extLower]) {
    return extensionMappings[extLower]
  }
  
  // Check pattern-based mappings
  const filenameLower = filename.toLowerCase()
  for (const pattern of filePatterns) {
    if (pattern.pattern.test(filenameLower)) {
      return { icon: pattern.icon, color: pattern.color }
    }
  }
  
  // Check categories as fallback
  for (const category of Object.values(categoryMappings)) {
    if (category.extensions.includes(extLower)) {
      return { icon: category.icon, color: category.color }
    }
  }
  
  // Return default file icon
  return defaultFileIcon
}

// Cache for performance
const iconCache = new Map<string, IconMapping>()

export function getCachedFileIcon(filename: string, extension: string): IconMapping {
  const cacheKey = `${filename}::${extension}`
  
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }
  
  const mapping = getFileIconMapping(filename, extension)
  iconCache.set(cacheKey, mapping)
  
  return mapping
}