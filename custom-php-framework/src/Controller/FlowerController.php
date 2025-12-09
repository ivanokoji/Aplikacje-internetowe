<?php
namespace App\Controller;

use App\Exception;
use App\Model\Flower;
use App\Service\Router;
use App\Service\Templating;

class FlowerController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $flowers = Flower::findAll();
        $html = $templating->render('flower/index.html.php', [
            'flowers' => $flowers,
            'router'  => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestFlower, Templating $templating, Router $router): ?string
    {
        if ($requestFlower) {
            $flower = Flower::fromArray($requestFlower);
            // @todo: validation
            $flower->save();

            $path = $router->generatePath('flower-index');
            $router->redirect($path);
            return null;
        } else {
            $flower = new Flower();
        }

        $html = $templating->render('flower/create.html.php', [
            'flower' => $flower,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $flowerId, ?array $requestFlower, Templating $templating, Router $router): ?string
    {
        $flower = Flower::find($flowerId);
        if (! $flower) {
            throw new NotFoundException("Missing flower with id $flowerId");
        }

        if ($requestFlower) {
            $flower->fill($requestFlower);
            // @todo: validation
            $flower->save();

            $path = $router->generatePath('flower-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('flower/edit.html.php', [
            'flower' => $flower,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $flowerId, Templating $templating, Router $router): ?string
    {
        $flower = Flower::find($flowerId);
        if (! $flower) {
            throw new NotFoundException("Missing flower with id $flowerId");
        }

        $html = $templating->render('flower/show.html.php', [
            'flower' => $flower,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $flowerId, Router $router): ?string
    {
        $flower = Flower::find($flowerId);
        if (! $flower) {
            throw new NotFoundException("Missing flower with id $flowerId");
        }

        $flower->delete();
        $path = $router->generatePath('flower-index');
        $router->redirect($path);
        return null;
    }
}
