<?php

/** @var \App\Model\Flower[] $flowers */
/** @var \App\Service\Router $router */

$title = 'Flower List';
$bodyClass = 'flower-index';

ob_start(); ?>
    <h1>Flower List</h1>

    <a href="<?= $router->generatePath('flower-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($flowers as $flower): ?>
            <li>
                <h3><?= htmlspecialchars($flower->getName()) ?> (<?= htmlspecialchars($flower->getColor()) ?>)</h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('flower-show', ['id' => $flower->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('flower-edit', ['id' => $flower->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php
$main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
