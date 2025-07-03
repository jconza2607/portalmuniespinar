<?php 

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class FileController extends Controller
{
    public function logo($filename)
    {
        $path = 'Z:\\' . $filename;

        if (!File::exists($path)) {
            abort(404);
        }

        return Response::file($path, [
            'Content-Type' => File::mimeType($path),
        ]);
    }
}
