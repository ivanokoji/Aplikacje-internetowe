<?php
/** @var $flower ?\App\Model\Flower */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="flower[name]" value="<?= $flower ? $flower->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="color">Color</label>
    <input type="text" id="color" name="flower[color]" value="<?= $flower ? $flower->getColor() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="flower[description]"><?= $flower ? $flower->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Save">
</div>
