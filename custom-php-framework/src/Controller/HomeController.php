<?php
namespace App\Controller;

use App\Model\Post;
use App\Model\Flower;
use App\Service\Router;
use App\Service\Templating;

class HomeController
{
    public function indexAction(Templating $templating, Router $router)
    {
        $posts = Post::findAll();
        $flowers = Flower::findAll();

        return $templating->render('home/index.html.php', [
            'posts' => $posts,
            'flowers' => $flowers,
            'router' => $router,
        ]);
    }
}
