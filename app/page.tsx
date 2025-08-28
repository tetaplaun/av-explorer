'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileVideo, Music, Image, Settings, PlayCircle, FolderOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <PlayCircle className="h-10 w-10 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">AV Explorer</h1>
              <p className="text-sm text-gray-400">Audio-Visual Media Management</p>
            </div>
          </div>
          <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileVideo className="mr-2 h-5 w-5 text-purple-500" />
                Videos
              </CardTitle>
              <CardDescription className="text-gray-400">
                Browse and manage video files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Video Library
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Music className="mr-2 h-5 w-5 text-green-500" />
                Audio
              </CardTitle>
              <CardDescription className="text-gray-400">
                Explore your music collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Audio Library
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Image className="mr-2 h-5 w-5 text-blue-500" />
                Images
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and organize photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Image Gallery
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Stats</CardTitle>
            <CardDescription className="text-gray-400">
              Your media library overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">0</p>
                <p className="text-sm text-gray-400">Videos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">0</p>
                <p className="text-sm text-gray-400">Audio Files</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">0</p>
                <p className="text-sm text-gray-400">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}