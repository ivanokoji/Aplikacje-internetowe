
<?php
/** @var \App\Model\Flower $flower */
/** @var \App\Service\Router $router */

$title = 'Create Flower';
$bodyClass = "edit flower-edit";

ob_start(); ?>
    <h1>Create Flower</h1>
    <form action="<?= $router->generatePath('flower-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="flower-create">
    </form>

    <a href="<?= $router->generatePath('flower-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
