<?php
/** @var \App\Model\Flower $flower */
/** @var \App\Service\Router $router */

$title = "Edit Flower {$flower->getName()} ({$flower->getId()})";
$bodyClass = "edit flower-edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('flower-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="flower-edit">
        <input type="hidden" name="id" value="<?= $flower->getId() ?>">
    </form>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('flower-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('flower-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure you want to delete this flower?')">
                <input type="hidden" name="action" value="flower-delete">
                <input type="hidden" name="id" value="<?= $flower->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
