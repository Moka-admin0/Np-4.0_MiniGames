fx_version "cerulean"

games { "gta5" }

description "NoPixel Boilerplate"

version "0.1.0"

-- Load NUI project
--ui_page 'http://localhost:3000'
ui_page 'nui/dist/index.html'

files {
    "nui/dist/**/*",
    "nui/dist/*"

}

client_scripts {
    "client/*"
}